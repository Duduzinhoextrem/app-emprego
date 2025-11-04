from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    Converte objetos Task para JSON e vice-versa.
    
    Usado quando vamos listar ou mostrar detalhes de uma tarefa.
    Inclui informações formatadas como username do criador e do designado,
    além de um campo 'completed' calculado para facilitar o uso no frontend.
    """
    user = serializers.SerializerMethodField()
    assigned_to_username = serializers.SerializerMethodField()
    completed = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'user', 'assigned_to', 'assigned_to_username', 'title', 'description', 'status', 'completed', 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'user', 'assigned_to_username', 'created_at', 'updated_at', 'completed_at', 'completed']

    def get_user(self, obj):
        """
        Retorna o username do usuário que criou a tarefa.
        """
        try:
            if hasattr(obj, 'user') and obj.user:
                return obj.user.username
            return None
        except Exception:
            return None

    def get_assigned_to_username(self, obj):
        """
        Retorna o username do usuário designado para fazer a tarefa.
        """
        try:
            if hasattr(obj, 'assigned_to') and obj.assigned_to:
                return obj.assigned_to.username
            return None
        except Exception:
            return None

    def get_completed(self, obj):
        """
        Retorna True se a tarefa está concluída.
        """
        try:
            if hasattr(obj, 'status'):
                return obj.status == 'completed'
            return False
        except Exception:
            return False

    def validate_title(self, value):
        """Garante que o título não está vazio."""
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()

    def validate_description(self, value):
        """Remove espaços extras da descrição."""
        if value:
            return value.strip()
        return value


class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer usado APENAS ao criar uma nova tarefa.
    
    Diferenças do TaskSerializer:
    - Requer o campo 'assigned_to' (obrigatório)
    - Não inclui campos calculados como 'completed' (ainda não existem)
    - O 'user' (criador) é definido automaticamente no backend
    """
    class Meta:
        model = Task
        fields = ['title', 'description', 'assigned_to']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()
    
    def validate_assigned_to(self, value):
        """Garante que o usuário designado é válido."""
        if not value:
            raise serializers.ValidationError("O usuário designado é obrigatório.")
        return value


class TaskUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer usado APENAS ao atualizar uma tarefa existente.
    
    Permite alterar:
    - Título
    - Descrição
    - Status (pendente/concluída)
    
    Não permite mudar o 'assigned_to' após criar (seria uma nova feature).
    O 'user' (criador) nunca muda após a criação.
    """
    class Meta:
        model = Task
        fields = ['title', 'description', 'status']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()
