from django.urls import path

from .views import PostCommentView, PostDetailView, PostLikeView, PostListView, SubscribeView

urlpatterns = [
    path('blog/posts', PostListView.as_view(), name='blog-post-list'),
    path('blog/posts/<slug:slug>', PostDetailView.as_view(), name='blog-post-detail'),
    path('blog/posts/<slug:slug>/like', PostLikeView.as_view(), name='blog-post-like'),
    path('blog/posts/<slug:slug>/comments', PostCommentView.as_view(), name='blog-post-comments'),
    path('blog/subscribe', SubscribeView.as_view(), name='blog-subscribe'),
]
