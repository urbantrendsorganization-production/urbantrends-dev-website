from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment, Like, Post, Subscription
from .serializers import (
    CommentSerializer,
    PostDetailSerializer,
    PostListSerializer,
    SubscriptionSerializer,
)


class BlogPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'


def _published_posts():
    return Post.objects.filter(
        status='published',
        published_at__lte=timezone.now(),
    ).select_related('author').prefetch_related('tags', 'likes', 'comments')


class PostListView(generics.ListAPIView):
    serializer_class   = PostListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class   = BlogPagination

    def get_queryset(self):
        qs = _published_posts()
        category = self.request.query_params.get('category')
        tag = self.request.query_params.get('tag')
        if category:
            qs = qs.filter(category=category)
        if tag:
            qs = qs.filter(tags__slug=tag)
        return qs


class PostDetailView(generics.RetrieveAPIView):
    serializer_class   = PostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'

    def get_queryset(self):
        return _published_posts()


class PostLikeView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def _get_post(self, slug):
        return generics.get_object_or_404(_published_posts(), slug=slug)

    def get(self, request, slug):
        post = self._get_post(slug)
        count = post.likes.count()
        is_liked = (
            post.likes.filter(user=request.user).exists()
            if request.user.is_authenticated else False
        )
        return Response({'count': count, 'is_liked': is_liked})

    def post(self, request, slug):
        post = self._get_post(slug)
        like, created = Like.objects.get_or_create(post=post, user=request.user)
        if not created:
            like.delete()
        count = post.likes.count()
        return Response({'count': count, 'is_liked': created}, status=status.HTTP_200_OK)


class PostCommentView(generics.GenericAPIView):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def _get_post(self, slug):
        return generics.get_object_or_404(_published_posts(), slug=slug)

    def get(self, request, slug):
        post = self._get_post(slug)
        qs = post.comments.select_related('user').order_by('-created_at')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, slug):
        post = self._get_post(slug)
        serializer = self.get_serializer(
            data=request.data,
            context={**self.get_serializer_context(), 'post': post},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SubscriptionSerializer(data=request.data)
        if not serializer.is_valid():
            errs = serializer.errors.get('email', [])
            if any(e == 'already_subscribed' for e in errs):
                return Response({'detail': 'already_subscribed'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        sub, created = Subscription.objects.get_or_create(email=email)
        if not created:
            sub.is_active = True
            sub.save(update_fields=['is_active'])

        if request.user.is_authenticated and not sub.user_id:
            sub.user = request.user
            sub.save(update_fields=['user'])

        return Response({'detail': 'subscribed'}, status=status.HTTP_200_OK)
