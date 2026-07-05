from rest_framework import serializers

from .models import Invoice, Order, OrderMessage, PricingPlan, QuoteRequest, Review, Service, ServiceCategory


class QuoteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuoteRequest
        fields = ['service_name', 'name', 'email', 'company', 'phone', 'budget_range', 'timeline', 'brief']


class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = [
            'id', 'tier', 'name', 'description', 'price', 'billing_cycle',
            'is_quote', 'features', 'is_popular', 'order',
        ]


class ServiceListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    is_tiered = serializers.BooleanField(source='uses_tiers', read_only=True)
    plans = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'slug', 'tagline',
            'icon_path', 'accent_color',
            'is_featured', 'is_tiered', 'order',
            'category_name', 'category_slug',
            'plans',
        ]

    def get_plans(self, obj):
        plans = list(obj.plans.all())
        # For tier-based services, order cards Basic → Standard → Premium.
        if obj.uses_tiers:
            plans.sort(key=lambda p: (PricingPlan.TIER_RANK.get(p.tier, 99), p.order))
        return PricingPlanSerializer(plans, many=True).data


class ServiceDetailSerializer(ServiceListSerializer):
    class Meta(ServiceListSerializer.Meta):
        fields = ServiceListSerializer.Meta.fields + ['description', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_slug = serializers.CharField(source='service.slug', read_only=True)
    plan_name = serializers.CharField(source='pricing_plan.name', read_only=True, default=None)

    class Meta:
        model = Order
        fields = [
            'id', 'customer_email', 'service', 'service_name', 'service_slug',
            'pricing_plan', 'plan_name', 'status',
            'requirements', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        return super().create(validated_data)


class OrderStaffUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'assigned_to', 'internal_notes']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'subtotal', 'tax_rate', 'total',
            'currency', 'notes', 'status', 'due_date', 'issued_at', 'paid_at',
        ]
        read_only_fields = fields


class OrderMessageSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    is_staff_sender = serializers.SerializerMethodField()

    class Meta:
        model = OrderMessage
        fields = ['id', 'sender_email', 'is_staff_sender', 'content', 'is_internal', 'created_at']
        read_only_fields = ['id', 'sender_email', 'is_staff_sender', 'created_at']

    def get_is_staff_sender(self, obj):
        return obj.sender.is_staff

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        validated_data['order'] = self.context['order']
        if not self.context['request'].user.is_staff:
            validated_data['is_internal'] = False
        return super().create(validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'comment',
            'author_name', 'author_role', 'company',
            'is_approved', 'created_at',
        ]
        read_only_fields = ['id', 'is_approved', 'created_at']

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate_comment(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Please write a few words about your experience.")
        return value.strip()
