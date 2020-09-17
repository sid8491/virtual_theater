from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    # path('ws/video/', consumers.VideoConsumer)
    re_path(r'ws/room/(?P<room_name>\w+)/$', consumers.VideoConsumer)
]
