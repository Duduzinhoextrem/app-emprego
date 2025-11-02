from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo Task.
    """
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Task
        fields = ['id', 'user', 'title', 'description', 'status', 'created_at', 'updated_at', 'completed_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'completed_at']

    def validate_title(self, value):
        """
        Valida que o título não seja vazio ou apenas espaços em branco.
        """
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()

    def validate_description(self, value):
        """
        Remove espaços em branco desnecessários da descrição.
        """
        if value:
            return value.strip()
        return value


class TaskCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para criação de tarefas.
    """
    class Meta:
        model = Task
        fields = ['title', 'description']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()


class TaskUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para atualização de tarefas.
    """
    class Meta:
        model = Task
        fields = ['title', 'description', 'status']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("O título não pode ser vazio.")
        return value.strip()
