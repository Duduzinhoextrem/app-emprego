from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import PasswordResetToken

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Converte objetos User para JSON.
    
    Usado para mostrar dados do usuário de forma segura.
    Nunca expõe informações sensíveis como senha ou tokens.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'created_at', 'is_staff', 'is_superuser']
        read_only_fields = ['id', 'created_at', 'is_staff', 'is_superuser']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer usado apenas no cadastro de novos usuários.
    
    Validações:
    - Username e email são únicos
    - Senha deve seguir regras de segurança (mínimo 8 caracteres, etc)
    - password_confirm deve ser igual ao password
    - Email deve ser válido
    
    Após validar, cria o usuário no banco de dados.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    """
    Valida e processa a alteração de senha do usuário logado.
    
    Requer:
    - old_password: a senha atual (para confirmar identidade)
    - new_password: a nova senha (deve seguir regras de segurança)
    - new_password_confirm: confirmação (deve ser igual à new_password)
    
    Não permite alterar senha se a senha antiga estiver incorreta.
    """
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "As senhas não coincidem."})
        return attrs

    def validate_old_password(self, value):
        """
        Verifica se a senha antiga está correta.
        
        Compara a senha fornecida com a senha atual do usuário.
        Se não bater, não permite alterar a senha (segurança).
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Senha antiga incorreta.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class RequestPasswordResetSerializer(serializers.Serializer):
    """
    Valida o email na solicitação de recuperação de senha.
    
    Apenas valida o formato do email. Por segurança, não verifica
    se o email existe ou não no sistema (isso é feito na view).
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Verifica apenas se o email tem formato válido.
        
        Por questões de segurança, não verificamos se o email existe no banco.
        Isso é feito na view, que sempre retorna sucesso (mesmo se não existir).
        Assim, não permitimos que alguém descubra quais emails estão cadastrados.
        """
        return value


class ResetPasswordSerializer(serializers.Serializer):
    """
    Valida e processa a redefinição de senha usando token.
    
    Requer:
    - token: o token recebido (deve ser válido e não expirado)
    - new_password: nova senha (deve seguir regras de segurança)
    - new_password_confirm: confirmação (deve ser igual)
    
    Verifica se o token existe, se é válido, se não expirou e se não foi usado.
    Após usar, marca o token como usado para que não possa ser reutilizado.
    """
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "As senhas não coincidem."})
        return attrs

    def validate_token(self, value):
        """
        Verifica se o token de recuperação é válido.
        
        Um token é válido apenas se:
        1. Existe no banco de dados
        2. Ainda não foi usado
        3. Ainda não expirou (menos de 24 horas desde a criação)
        
        Se qualquer uma dessas condições falhar, retorna erro.
        """
        try:
            token_obj = PasswordResetToken.objects.get(token=value)
            if not token_obj.is_valid():
                raise serializers.ValidationError("Token inválido ou expirado.")
            return value
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Token inválido ou expirado.")

    def save(self):
        """
        Aplica a nova senha no usuário e invalida o token.
        
        Processo:
        1. Busca o token e o usuário associado
        2. Define a nova senha (já validada anteriormente)
        3. Salva o usuário
        4. Marca o token como usado (não pode mais ser reutilizado)
        
        Retorna o usuário atualizado.
        """
        token_obj = PasswordResetToken.objects.get(token=self.validated_data['token'])
        user = token_obj.user
        
        # Aplica a nova senha (o Django faz hash automaticamente)
        user.set_password(self.validated_data['new_password'])
        user.save()
        
        # Marca o token como usado para que não possa ser reutilizado
        # Mesmo que alguém tenha salvo o token, ele só funciona uma vez
        token_obj.used = True
        token_obj.save()
        
        return user
