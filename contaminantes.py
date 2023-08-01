import pandas as pd;

class Contaminantes:

    csv_measures = any
    stations_catalogue = any
    pm2_5 = any
    final_pm2_5 = any
    min_value = 0
    max_value = 0

    # Inicializando los valores.
    def __init__(self):
        self.stations_catalogue = pd.read_csv("./catalogo_estaciones.csv")
        self.csv_measures = pd.read_csv("./modified.csv")

    # Creando el arreglo
    def create_info(self):
        self.pm2_5 = self.csv_measures[self.csv_measures['cve_parameter'] == "PM2.5"] 
        self.final_pm2_5 = self.pm2_5.merge(self.stations_catalogue)

    # Obteniendo el valor máximo de los contaminantes
    def get_max_value(self):
        self.max_value = self.final_pm2_5["value"].max()
        print(self.max_value)

    # Obteniendo el valor mínimo de los contaminantes
    def get_min_value(self):
        self.min_value = self.final_pm2_5["value"].min()
        print(self.min_value)

    # Imprimir N filas del dataframe final
    def print_n_rows(self, n):
        pd.set_option('display.max_rows', n)
        print(self.final_pm2_5)
    
    # Crear JSON del dataframe final
    def create_json(self, output_name):
        self.final_pm2_5.to_json(output_name, orient='split')
        
    # Crear CSV del dataframe final
    def create_csv(self, output_name):
        self.final_pm2_5.to_csv(output_name, index=False)