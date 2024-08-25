import time
import winsound
import threading

def emitir_alerta():
    # Três tipos de sons diferentes
    sons = [
        (1000, 500),  # 1000 Hz, 500 ms
    ]
    for frequencia, duracao in sons:
        for _ in range(3):  # Emitir o som 3 vezes
            winsound.Beep(frequencia, duracao)
            time.sleep(0.5)  # Pausa de 0.5 segundos entre os bipes

def cronometro(intervalos):
    def iniciar_timer(intervalo):
        while True:
            print(f"Cronômetro iniciado para {intervalo} segundos.")
            time.sleep(intervalo)
            emitir_alerta()
            print(f"Alerta emitido após {intervalo} segundos.")
    
    # Iniciar um thread para cada intervalo
    for intervalo in intervalos:
        threading.Thread(target=iniciar_timer, args=(intervalo,)).start()

if __name__ == "__main__":
    # Lista de intervalos de tempo em segundos
    intervalos = [60, 600, 3600]  # Pode ser ajustado conforme necessário
    cronometro(intervalos)