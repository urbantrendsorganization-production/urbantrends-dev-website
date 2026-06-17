from rest_framework import serializers
from .models import GmailThread, GmailMessage


class GmailMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GmailMessage
        fields = [
            'message_id', 'from_email', 'to_emails', 'subject',
            'body_text', 'sent_at', 'has_attachments',
        ]
        read_only_fields = fields


class GmailThreadSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True, default=None)
    order_id = serializers.IntegerField(source='order.id', read_only=True, default=None)

    class Meta:
        model = GmailThread
        fields = [
            'thread_id', 'subject', 'snippet', 'from_email', 'to_emails',
            'message_count', 'last_message_at', 'has_attachments',
            'is_read', 'is_starred', 'client_id', 'client_name', 'order_id', 'notes',
        ]
        read_only_fields = fields


class GmailThreadDetailSerializer(GmailThreadSerializer):
    messages = GmailMessageSerializer(many=True, read_only=True)

    class Meta(GmailThreadSerializer.Meta):
        fields = GmailThreadSerializer.Meta.fields + ['messages', 'labels', 'synced_at']
