from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password,check_password
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,parser_classes
from rest_framework.response import Response


from rest_framework.parsers import MultiPartParser, FormParser

import random

from .models import *
from .serializers import *


# Create your views here.
@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    
    if user is not None and user.is_staff:
        return Response({'message': 'Login successful', 'username':username}, status=200)
    else:
        return Response({'message': 'Invalid credentials'}, status=401)
    


@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')

    if not category_name:
        return Response({'message': 'Category name is required'}, status=400)

    Category.objects.create(category_name=category_name)

    # Simulate adding category logic
    return Response({'message': f'Category "{category_name}" added successfully'}, status=201)

@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response({'categories': serializer.data})

@api_view(['GET'])
def list_foods(request):
    foods = Food.objects.all()
    serializer = FoodSerializer(foods, many=True)
    return Response({'foods': serializer.data})


@api_view(['GET'])
def food_search(request):
    query = request.GET.get('q', '')
    foods = Food.objects.filter(item_name__icontains=query)
    serializer = FoodSerializer(foods, many=True)
    return Response({'foods': serializer.data})



@api_view(['GET'])
def random_foods(request):
    foods = list(Food.objects.all())
    random.shuffle(foods)
    limited_foods = foods[0:9] 
    serializer = FoodSerializer(limited_foods, many=True)
    return Response({'foods': serializer.data})


@api_view(['GET'])
def food_detail(request, id):
    try:
        food = get_object_or_404(Food, id=id)
        serializer = FoodSerializer(food)
        return Response({'food': serializer.data})
    except Food.DoesNotExist:
        return Response({'message': 'Food item not found'}, status=404)





@parser_classes([MultiPartParser, FormParser])
@api_view(['POST'])
def add_food_item(request):
    serilizer = FoodSerializer(data=request.data)
    if serilizer.is_valid():
        serilizer.save()
        return Response({'message': 'Food item added successfully'}, status=201)
    return Response({'message': 'Failed to add food item'}, status=400)



@api_view(['POST'])
def register_user(request):
    first_name = request.data.get('firstName')
    last_name = request.data.get('lastName')
    email = request.data.get('email')
    mobile = request.data.get('mobileNumber')
    password = request.data.get('password')

    if not first_name or not last_name or not email or not mobile or not password:
        return Response({'message': 'All fields are required'}, status=400)
    if User.objects.filter(email=email).exists() or User.objects.filter(mobile = mobile).exists():
        return Response({'message': 'User with this email or mobile number already exists'}, status=400)
    User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        mobile=mobile,
        password=make_password(password)
    )
    return Response({'message': f'User {first_name} registered successfully'}, status=201)



@api_view(['POST'])
def login_user(request):
    
    identifier = request.data.get('emailContact')
    password = request.data.get('password')

    if not identifier or not password:
        return Response({'message': 'Email/Contact and Password are required'}, status=400)
    
    user = User.objects.filter(email=identifier).first() or User.objects.filter(mobile=identifier).first()
    
    if user and check_password(password, user.password):
        return Response({
            'message': 'Login successful',
            'userId': user.id,
            'userName': f"{user.first_name} {user.last_name}"
        }, status=200)
    else:
        return Response({'message': 'Invalid email/contact or password'}, status=401)
       

@api_view(['POST'])
def add_to_cart(request):
    
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')

    if not user_id or not food_id:
        return Response({'message': 'User ID and Food ID are required'}, status=400)
    
    try:
        user = User.objects.get(id=user_id)
        food = Food.objects.get(id=food_id)
    except (User.DoesNotExist, Food.DoesNotExist):
        return Response({'message': 'Invalid User ID or Food ID'}, status=400)

    

    order,created = Order.objects.get_or_create(user=user, food=food, is_order_placed=False, defaults={'quantity': 1})

    if not created:
        order.quantity += 1
        order.save()

    return Response({'message': 'Item added to cart successfully'}, status=201)


@api_view(['GET'])
def get_cart_items(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'message': 'Invalid User ID'}, status=400)
    
    cart_items = Order.objects.filter(user=user, is_order_placed=False).select_related('food')
    serializer = CartItemSerializer(cart_items, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
def update_cart_quantity(request):
    order_id = request.data.get('orderId')
    quantity = request.data.get('newQty')

    
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)
        order.quantity = quantity
        order.save()
        return Response({"message":"quantity updated successfully"}, status=200)
    except:
        return Response({'message': 'Something went wrong'}, status=404)

@api_view(['DELETE'])
def delete_cart_item(request,order_id):    
    
    try:
        order = Order.objects.get(id=order_id, is_order_placed=False)  
        order.delete()
        return Response({"message":"Item deleted from the cart successfully"}, status=200)
    except:
        return Response({'message': 'Something went wrong'}, status=404)


def make_unique_order_number():
    while True:
        num = str(random.randint(100000000,999999999))
        if not OrderAddress.objects.filter(order_number=num).exists():
            return num

@api_view(['POST'])
def place_order(request):
    user_id = request.data.get('userId')
    address = request.data.get('address')
    payment_mode = request.data.get('paymentMode')
    card_number = request.data.get('cardNumber')
    expiry = request.data.get('expiry')
    cvv = request.data.get('cvv')

    try:
        order = Order.objects.filter(user_id=user_id, is_order_placed=False)  

        order_number = make_unique_order_number()

        order.update(order_number=order_number, is_order_placed = True)

        OrderAddress.objects.create(
            user_id = user_id,
            order_number = order_number,
            address = address,
        )

        PaymentDetails.objects.create(
            user_id = user_id,
            order_number = order_number,
            payment_mode = payment_mode,
            card_number = card_number if payment_mode == 'online' else None,
            expiry_date = expiry if payment_mode == 'online' else None,
            cvv = cvv if payment_mode == 'online' else None,
        )

        return Response({"message":f"Order placed successfully! Order No: {order_number}"}, status=201)

    except (User.DoesNotExist, Food.DoesNotExist):
        return Response({'message': 'Something went wrong'}, status=404)





@api_view(['GET'])
def user_order(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'message': 'Invalid User ID'}, status=400)
    
    
    orders = OrderAddress.objects.filter(user=user).order_by('-id')
    serializer = MyOrderListSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def order_by_order_number(request, order_number):
    
    orders = Order.objects.filter(order_number=order_number, is_order_placed = True).select_related('food')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)





@api_view(['GET'])
def get_order_address(request, order_number):
    
    address = OrderAddress.objects.get(order_number=order_number)
    serializer = OrderAddressSerializer(address)
    return Response(serializer.data)

def get_invoice(request, order_number):
    orders = Order.objects.filter(order_number=order_number, is_order_placed = True).select_related('food')
    address = OrderAddress.objects.get(order_number=order_number)

    grandTotal = 0
    order_data = []

    for order in orders:
        total_price = order.food.item_price * order.quantity
        grandTotal += total_price
        order_data.append({
            'food':order.food,
            'quantity':order.quantity,
            'total_price':total_price,
        })
    return render(request, 'invoice.html' , {
            'order_number': order_number,
            'address': address,
            'grandTotal': grandTotal,
            'orders': order_data,
        })






@api_view(['GET'])
def get_user_profile(request, user_id):
    
    user = User.objects.get(id=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
def update_user_profile(request, user_id):
    user = User.objects.get(id=user_id)

    serializer = UserSerializer(user,data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Profile updated successfully"}, status=200)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def change_password(request, user_id):

    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    user = User.objects.get(id=user_id)

    if not check_password(current_password,user.password):
        return Response({"message":"Current password is incorrect"}, status=400)

    user.password = make_password(new_password)
    
    user.save()
        
    return Response({"message":"Password changed successfully"}, status=200)

@api_view(['GET'])
def orders_not_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status__isnull = True).order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def orders_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status = "Order Confirmed").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_being_prepared(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food being Prepared").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def food_pickup(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food Pickup").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_delivered(request):
    orders = OrderAddress.objects.filter(order_final_status = "Food Delivered").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def order_cancelled(request):
    orders = OrderAddress.objects.filter(order_final_status = "Order Cancelled").order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def all_orders(request):
    orders = OrderAddress.objects.all().order_by('-order_time')
    serializer = OrderSummarySerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['POST'])
def order_between_dates(request):
    from_date = request.data.get('from_date')
    to_date = request.data.get('to_date')
    status = request.data.get('status')

    orders = OrderAddress.objects.filter(order_time__date__range=[from_date,to_date])
    if status == 'Not Confirmed':
        orders = orders.filter(order_final_status__isnull = True)
    elif status != 'all':
        orders = orders.filter(order_final_status = status)
      
    serializer = OrderSummarySerializer(orders.order_by('-order_time'), many=True)
    return Response(serializer.data)





@api_view(['GET'])
def view_order_detail(request,order_number):
    
    try:
        order_address = OrderAddress.objects.select_related('user').get(order_number=order_number)
        ordered_foods = Order.objects.filter(order_number=order_number).select_related('food')
        tracking = FoodTracking.objects.filter(order__order_number=order_number)
    except:
        return Response({'error':'something went wrong.'}, status=404)
      

    return Response({
        'order' : OrderDetailSerializer(order_address).data,
        'foods' : OrderedFoodSerializer(ordered_foods, many=True).data,
        'tracking' : FoodTrackingSerializer(tracking, many=True).data,
    })





@api_view(['POST'])
def update_order_status(request):
    order_number = request.data.get('order_number')
    new_status = request.data.get('status')
    remark = request.data.get('remark')

    try:
        address = OrderAddress.objects.get(order_number=order_number)
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({'error':'order not found'}, status=400)
        FoodTracking.objects.create(order=order, remark=remark, status=new_status,order_cancelled_by_user=False)
        address.order_final_status = new_status
        address.save()
        return Response({'message':'order status updated successfully'})
    except OrderAddress.DoesNotExist:
        return Response({'error':'Invalid order nubmer'}, status=400)





@api_view(['GET'])
def search_orders(request):
    query = request.GET.get('q', '')
    if query:
        orders = OrderAddress.objects.filter(order_number__icontains=query)
    else:
        orders = []
    serializer = serializer = OrderSummarySerializer(orders.order_by('-order_time'), many=True)
    return Response(serializer.data)




@api_view(['GET','PUT','DELETE'])
def category_detail(request,id):
    try:
        category = Category.objects.get(id=id)
    except Category.DoesNotExist:
        return Response({'error':'category not found'}, status=404)
    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    elif request.method == 'PUT':

        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response({'message':'category updated successfully'}, status=200)
    
    elif request.method == 'DELETE':

        category.delete()
        return Response({'message':'category deleted successfully'}, status=200)
    

@api_view(['DELETE'])
def delete_food(request,id):
    try:
        food = Food.objects.get(id=id)
        food.delete()
        return Response({'message':'food deleted successfully'}, status=200)
    except Food.DoesNotExist:
        return Response({'error':'food not found'}, status=404)
    


@api_view(['GET','PUT'])
@parser_classes([MultiPartParser, FormParser])
def edit_food(request,id):
    try:
        food = Food.objects.get(id=id)
    except Food.DoesNotExist:
        return Response({'error':'food not found'}, status=404)
    if request.method == 'GET':
        serializer = FoodSerializer(food)
        return Response(serializer.data)
    elif request.method == 'PUT':
        data = request.data.copy()
        if 'image' not in request.FILES:
            data['image'] = food.image
        if 'is_available' in data:
            data['is_available'] = data['is_available'].lower() == 'true'
        serializer = FoodSerializer(food, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
        return Response({'message':'food updated successfully'}, status=200)


@api_view(['GET'])
def list_users(request):
    users = User.objects.all().order_by('-id')
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
   
@api_view(['DELETE'])
def delete_user(request,id):
    try:
        user = User.objects.get(id=id)
        user.delete()
        return Response({'message':'user deleted successfully'}, status=200)
    except Food.DoesNotExist:
        return Response({'error':'user not found'}, status=404)
    


from django.utils.timezone import now, timedelta
from django.db.models import Sum,F,DecimalField


@api_view(['GET'])
def dashboard_metrics(request):
    today = now().date()
    start_week = today - timedelta(days=today.weekday())
    start_month = today.replace(day=1)
    start_year = today.replace(month=1,day=1)
    def get_sales_total(start_date):
        paid_orders = PaymentDetails.objects.filter(payment_date__gte=start_date).values_list('order_number',flat=True)
        total = Order.objects.filter(order_number__in=paid_orders).annotate(
            total_price =F('quantity') * F('food__item_price')
        ).aggregate(sale_amount=Sum('total_price'))['sale_amount'] or 0.00
        return round(total,2)
    data = {
        "total_orders": OrderAddress.objects.count(),
        "new_orders": OrderAddress.objects.filter(order_final_status__isnull = True).count(),
        "confirmed_orders": OrderAddress.objects.filter(order_final_status = "Order Confirmed").count(),
        "food_preparing": OrderAddress.objects.filter(order_final_status = "Food being Prepared").count(),
        "food_pickup": OrderAddress.objects.filter(order_final_status = "Food Pickup").count(),
        "food_delivered": OrderAddress.objects.filter(order_final_status = "Food Delivered").count(),
        "cancelled_orders": OrderAddress.objects.filter(order_final_status = "Order Cancelled").count(),
        "total_users": User.objects.count(),
        "total_categories": Category.objects.count(),
        "total_reviews": Review.objects.count(),
        "total_wishlists": Wishlist.objects.count(),
        "today_sales": get_sales_total(today),
        "week_sales": get_sales_total(start_week),
        "month_sales": get_sales_total(start_month),
        "year_sales": get_sales_total(start_year),
    }
    
    return Response(data)

from decimal import Decimal
from collections import defaultdict
from django.db.models.functions import TruncMonth,Coalesce,TruncWeek
@api_view(['GET'])
def monthly_sales_summary(request):
    orders = (Order.objects
              .filter(is_order_placed=True)
              .values('order_number')
              .annotate(total_price =Coalesce(Sum(F('quantity') * F('food__item_price'),output_field=DecimalField(decimal_places=2)),Decimal('0.00')
    )))


    order_price_map = {
       o['order_number']: o['total_price'] for o in orders
    }

    addresses = (
        OrderAddress.objects
        .filter(order_number__in=order_price_map.keys())
        .annotate(month=TruncMonth('order_time'))
        .values('month','order_number')
    )

    month_totals = defaultdict(lambda: Decimal('0.00'))

    for address in addresses:
        label = address['month'].strftime('%b')
        month_totals[label] += order_price_map.get(address['order_number'],Decimal('0.00'))


    result = [{"month":m,"sales":total} for m,total in month_totals.items()]
    return Response(result)


@api_view(['GET'])
def top_selling_foods(request):
    top_foods = (Order.objects
              .filter(is_order_placed=True)
              .values('food__item_name')
              .annotate(total_sold =Sum('quantity'))
              .order_by('-total_sold')[:5]
              )

    return Response(top_foods)

@api_view(['GET'])
def weekly_sales_summary(request):
    orders = (Order.objects
              .filter(is_order_placed=True)
              .values('order_number')
              .annotate(total_price =Coalesce(Sum(F('quantity') * F('food__item_price'),output_field=DecimalField(decimal_places=2)),Decimal('0.00')
    )))


    order_price_map = {
       o['order_number']: o['total_price'] for o in orders
    }

    addresses = (
        OrderAddress.objects
        .filter(order_number__in=order_price_map.keys())
        .annotate(week=TruncWeek('order_time'))
        .values('week','order_number')
    )

    week_totals = defaultdict(lambda: Decimal('0.00'))

    for address in addresses:
        label = address['week'].strftime('Week %W')
        week_totals[label] += order_price_map.get(address['order_number'],Decimal('0.00'))


    result = [{"week":w,"sales":total} for w,total in week_totals.items()]
    return Response(result)


from django.db.models import Count
@api_view(['GET'])
def weekly_user_registration(request):
    

    data = (
        User.objects
        .annotate(week=TruncWeek('reg_date'))
        .values('week')
        .annotate(new_users = Count('id'))
        .order_by('week')
    )

    
    result = [{"week":entry['week'].strftime('Week %W'),"new_users":entry['new_users']} for entry in data]
    return Response(result)



@api_view(['POST'])
def add_to_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')

    obj, created = Wishlist.objects.get_or_create(user_id=user_id,food_id=food_id)

    if created:
        return Response({'message': 'Added to Wishlist'}, status=201)
    else:
        return Response({'message': 'Already in Wishlist'}, status=400)


@api_view(['POST'])
def delete_from_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id') 

    try:
        Wishlist.objects.get(user_id=user_id,food_id=food_id).delete()
        return Response({'message': 'Remove from Wishlist'}, status=200)
    except Wishlist.DoesNotExist:
        return Response({'message': 'Item not found in Wishlist'}, status=404)

@api_view(['GET'])
def get_wishlist(request,user_id):

    wishlist_items= Wishlist.objects.filter(user_id=user_id)
    serializer = WishlistSerializer(wishlist_items,many=True)
    return Response(serializer.data)

 

@api_view(['GET'])
def track_order(request,order_number):

    sample_order= Order.objects.filter(order_number=order_number, is_order_placed=True).first()

    
    if not sample_order:
        return Response({'message': 'Order not found or placed yet'}, status=404)
    
    
    tracking_entries= FoodTracking.objects.filter(order=sample_order)

    
    serializer = FoodTrackingSerializer(tracking_entries,many=True)
    return Response(serializer.data)

 

@api_view(['POST'])
def cancel_order(request,order_number):
    remark = request.data.get('remark')
    
    address = OrderAddress.objects.get(order_number=order_number)

    sample_order = Order.objects.filter(order_number=order_number).first()
    FoodTracking.objects.create(
        order = sample_order,
        remark = remark,
        status = "Ordered Cancelled",
        order_cancelled_by_user = True
    )

    address.order_final_status = "Order Cancelled"
    address.save()
    return Response({'message': 'Ordered Cancelled successfully'}, status=200)


@api_view(['POST'])
def add_review(request,food_id):
    user_id = request.data.get('user_id')
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    try:
        user = User.objects.get(id = user_id)
        food = Food.objects.get(id = food_id)

    except(User.DoesNotExist, Food.DoesNotExist):

        return Response({'message': 'User and Food not found '}, status=404)
    
    Review.objects.create(
        user = user,
        food = food,
        rating = rating,
        comment = comment
    )

    return Response({'message': 'Review submitted'}, status=201)


@api_view(['GET'])
def food_reviews(request,food_id):

    reviews = Review.objects.filter(food_id=food_id).order_by('-created_at')
  
    serializer = ReviewSerializer(reviews,many=True)
    return Response(serializer.data)


@api_view(['DELETE','PUT'])
def review_detail(request,edit_id):

    try:
        review = Review.objects.get(id=edit_id)
    except Review.DoesNotExist:
          return Response({'message': 'Review not found'}, status=404)

    if request.method == 'DELETE':
        review.delete()
        return Response({'message': 'Review deleted'}, status=200)
    
    if request.method == 'PUT':
        data = {"rating":request.data.get("rating",review.rating),
                "comment":request.data.get("comment",review.comment),
                }
        serializer = ReviewSerializer(review,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Review updated'}, status=200)
        
        return Response(serializer.errors, status=400)

from django.db.models import Avg,Count
@api_view(['GET'])
def food_rating_summary(request,food_id):

    reviews = Review.objects.filter(food_id=food_id)

    rating_summary = reviews.values('rating').annotate(count=Count('rating')).order_by('-rating')
    
    average_rating = reviews.aggregate(average = Avg('rating'))['average'] or 0

    total_reviews =reviews.count()

    return Response({
        
        "average": round(average_rating,1),
        "total_reviews": total_reviews,
        'breakdown': {entry['rating']: entry['count'] for entry in rating_summary}
    })


@api_view(['GET'])
def all_reviews(request):

    reviews = Review.objects.select_related('user', 'food').all().order_by('-created_at')
  
    serializer = ReviewSerializer(reviews,many=True)
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_review(request, review_id):

    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response({'message': 'Review not found'}, status=404)

    review.delete()
    return Response({'message': 'Review deleted successfully'}, status=200)