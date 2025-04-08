from django.shortcuts import render
from django_nextjs.render import render_nextjs_page
# Create your views here.
async def home(request):
    # Your custom logic
    return await render_nextjs_page(request)