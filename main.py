import asyncio
import websockets

all_locations = {}
list_of_coordinates = []

class Location:
    def __init__(self, location, teleport, coordinates, teleport_type):
        self.location = location
        self.teleport = teleport
        self.coordinates = coordinates
        self.teleport_type = teleport_type
        all_locations[self.location] = [self.coordinates, self.teleport, self.teleport_type]


def parse_line(line: str) -> tuple:
    parts = line.split(";")
    if len(parts) != 4:
        return None
    location = parts[0].strip()
    teleport = parts[1].strip()
    coordinates = list(map(int, parts[2].strip("() ").split(",")))
    teleport_type = parts[3].strip()
    return location, teleport, coordinates, teleport_type

text_files = ['teleports/fairy_rings.txt', 'teleports/standard_spellbook.txt']

for file in text_files:
    with open(file, 'r') as script:
        lines = script.read().splitlines()

        for line in lines:
            parsed_line = parse_line(line)
            if parsed_line is None:
                continue
            location, teleport, coordinates, teleport_type = parsed_line
            location_obj = Location(location, teleport, coordinates, teleport_type)
            list_of_coordinates.append(coordinates)

async def handle_connection(websocket, path):
    while True:
        data = await websocket.recv()
        x, y = data.split(',')
        user_coords = [int(x), int(y), 0]
        closest_coordinates = None
        min_distance = None

        for point in list_of_coordinates:
            distance = ((user_coords[0] - point[0]) ** 2 + (user_coords[1] - point[1]) ** 2) ** 0.5

            if min_distance is None or distance < min_distance:
                min_distance = distance
                closest_coordinates = point
        if closest_coordinates in list_of_coordinates:
            for key, val in all_locations.items():
                if val[0] == closest_coordinates and val[2] == 'fairy ring':
                    response = f"{key} -- Use {val[2]}: {val[1]}"
                    await websocket.send(response)
                elif val[0] == closest_coordinates and val[2] == 'teleport':
                    response = f"Use {val[1]}"
                    await websocket.send(response)
        else:
            await websocket.send('No match')

start_server = websockets.serve(handle_connection, 'localhost', 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
