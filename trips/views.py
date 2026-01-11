from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services import get_route, generate_logs

class TripAPIView(APIView):

    def post(self, request):
        try:
            data = request.data

            current = data.get("current")
            pickup = data.get("pickup")
            dropoff = data.get("dropoff")
            cycle_used = float(data.get("cycle_used", 0))

            if not (current and pickup and dropoff):
                return Response(
                    {"error": "Missing coordinates"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            distance, duration, geometry = get_route(
                current,
                pickup,
                dropoff
            )

            logs = generate_logs(duration, cycle_used)

            return Response({
                "distance_km": round(distance, 2),
                "duration_hours": round(duration, 2),
                "route_geometry": geometry,
                "daily_logs": logs
            })

        except Exception as e:
            print("ERROR:", e)
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
