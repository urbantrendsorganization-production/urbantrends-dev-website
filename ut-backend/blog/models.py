from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Post(models.Model):
    CATEGORY_CHOICES = [
        ('engineering', 'Engineering'),
        ('product',     'Product'),
        ('company',     'Company'),
        ('guides',      'Guides'),
    ]
    STATUS_CHOICES = [
        ('draft',     'Draft'),
        ('published', 'Published'),
    ]

    title            = models.CharField(max_length=255)
    slug             = models.SlugField(max_length=255, unique=True, blank=True)
    excerpt          = models.TextField(help_text='Short summary shown on listing cards.')
    body             = models.TextField(help_text='Full post content in Markdown.')
    cover_image_url  = models.URLField(blank=True, help_text='Optional cover image URL.')
    category         = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='engineering')
    accent_color     = models.CharField(max_length=7, default='#34D399', help_text='Hex color for card accent.')
    tags             = models.ManyToManyField(Tag, blank=True, related_name='posts')
    author           = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, related_name='blog_posts',
    )
    status           = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    published_at     = models.DateTimeField(null=True, blank=True)
    read_time        = models.PositiveIntegerField(default=1, editable=False)
    meta_description = models.TextField(blank=True, help_text='SEO description override (falls back to excerpt).')
    og_image_url     = models.URLField(blank=True, help_text='OG image override (falls back to cover_image_url).')
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Post.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{n}'
                n += 1
            self.slug = slug

        self.read_time = max(1, len(self.body.split()) // 200)

        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)


class Like(models.Model):
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['post', 'user'], name='unique_post_like')]

    def __str__(self):
        return f'{self.user} liked {self.post}'


class Comment(models.Model):
    post       = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_comments')
    content    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Comment by {self.user} on {self.post}'


class Subscription(models.Model):
    email      = models.EmailField(unique=True)
    user       = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='blog_subscription',
    )
    is_active  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email
