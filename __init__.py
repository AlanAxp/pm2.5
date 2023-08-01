from contaminantes import Contaminantes

def main():
    contaminantes = Contaminantes()
    contaminantes.create_info()
    # contaminantes.print_n_rows(20)
    contaminantes.create_json("merged.json")

if __name__ == "__main__":
    main()