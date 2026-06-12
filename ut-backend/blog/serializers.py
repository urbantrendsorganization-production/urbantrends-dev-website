from rest_framework import serializers

from .models import Comment, Like, Post, Subscription, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class PostListSerializer(serializers.ModelSerializer):
    tags         = TagSerializer(many=True, read_only=True)
    author_name  = serializers.SerializerMethodField()
    like_count   = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'slug', 'title', 'excerpt', 'category', 'accent_color',
            'author_name', 'published_at', 'read_time',
            'tags', 'cover_image_url',
            'like_count', 'comment_count',
        ]

    def get_author_name(self, obj):
        if not obj.author:
            return 'UrbanTrends'
        full = obj.author.get_full_name()
        return full if full.strip() else obj.author.email

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_comment_count(self, obj):
        return obj.comments.count()


class PostDetailSerializer(PostListSerializer):
    is_liked_by_me = serializers.SerializerMethodField()

    class Meta(PostListSerializer.Meta):
        fields = PostListSerializer.Meta.fields + [
            'body', 'meta_description', 'og_image_url',
            'updated_at', 'is_liked_by_me',
        ]

    def get_is_liked_by_me(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.likes.filter(user=request.user).exists()


class CommentSerializer(serializers.ModelSerializer):
    author_name     = serializers.SerializerMethodField()
    author_initials = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author_name', 'author_initials', 'content', 'created_at']
        read_only_fields = ['id', 'author_name', 'author_initials', 'created_at']

    def get_author_name(self, obj):
        full = obj.user.get_full_name()
        return full if full.strip() else obj.user.email.split('@')[0]

    def get_author_initials(self, obj):
        full = obj.user.get_full_name().strip()
        if full:
            parts = full.split()
            return (parts[0][0] + (parts[-1][0] if len(parts) > 1 else '')).upper()
        return obj.user.email[0].upper()

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['post'] = self.context['post']
        return super().create(validated_data)


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['email']

    def validate_email(self, value):
        existing = Subscription.objects.filter(email=value).first()
        if existing and existing.is_active:
            raise serializers.ValidationError('already_subscribed')
        return value
