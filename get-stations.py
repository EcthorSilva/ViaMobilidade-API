import requests

def get_next_station(station_code):
    url = f"https://apim-proximotrem-prd-brazilsouth-001.azure-api.net/api/v1/lines/L9/stations/{station_code}/next-train"
    
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        if data:
            if len(data) > 1:
                next_station = data[1]["estacao_destino"]
            else:
                next_station = data[0]["estacao_destino"]
            return next_station
        else:
            return None
    else:
        print(f"Erro ao acessar o endpoint para a estação {station_code}. Status: {response.status_code}")
        return None

def get_all_destinations(start_station):
    destinations = []
    current_station = start_station
    
    while current_station:
        # print(f"Pegando estação: {current_station}", flush=True)
        destinations.append(current_station)
        next_station = get_next_station(current_station)
        
        if not next_station:
            break
        
        if next_station in destinations:
            break
        
        current_station = next_station
    
    return destinations

start_station = "MVN"
all_destinations = get_all_destinations(start_station)

print("\nEstações encontradas na linha 9 Esmeralda:")
for station in all_destinations:
    print(station)
