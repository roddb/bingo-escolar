'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, RotateCcw, Dices } from 'lucide-react';

const BingoEscolar = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);

  // Inicializar números disponibles (1-90)
  useEffect(() => {
    setAvailableNumbers(Array.from({length: 90}, (_, i) => i + 1));
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setCurrentNumber(null);
    setCalledNumbers([]);
    setAvailableNumbers(Array.from({length: 90}, (_, i) => i + 1));
  };

  const drawNumber = () => {
    if (availableNumbers.length === 0) {
      alert('¡Todos los números han salido! Presiona "Reiniciar" para otra partida.');
      return;
    }

    setIsDrawing(true);
    
    // Simular animación del bolillero
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const drawnNumber = availableNumbers[randomIndex];
      
      setCurrentNumber(drawnNumber);
      setCalledNumbers(prev => [...prev, drawnNumber]);
      setAvailableNumbers(prev => prev.filter(num => num !== drawnNumber));
      setIsDrawing(false);
    }, 2000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentNumber(null);
    setCalledNumbers([]);
    setAvailableNumbers(Array.from({length: 90}, (_, i) => i + 1));
    setIsDrawing(false);
  };

  const renderNumberBoard = () => {
    const numbers = Array.from({length: 90}, (_, i) => i + 1);
    
    return (
      <div className="grid grid-cols-9 gap-1 w-full max-w-xl mx-auto">
        {numbers.map(num => (
          <motion.div
            key={num}
            initial={{ scale: 1 }}
            animate={{ 
              scale: calledNumbers.includes(num) ? 1.1 : 1,
              rotateY: calledNumbers.includes(num) ? 360 : 0
            }}
            transition={{ duration: 0.5 }}
            className={`
              w-10 h-10 flex items-center justify-center text-sm font-bold rounded-lg border-2 transition-all duration-500
              ${calledNumbers.includes(num) 
                ? 'bg-red-500 text-white border-red-600 shadow-lg' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            `}
          >
            {num}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 p-2 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header con logo real desde Imgur */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-3 flex items-center justify-center gap-4"
        >
          {/* Logo real del colegio desde ImgBB */}
          <Card className="p-2 shadow-xl border-2 border-blue-200">
            <div className="relative h-14 w-52">
              <Image
                src="https://i.ibb.co/C3FPySjg/Whats-App-Image-2025-08-30-at-11-30-32.jpg"
                alt="Colegio Santo Tomás de Aquino - Sede Colegiales - UCA"
                fill
                className="object-contain"
                priority
                onLoad={() => console.log('¡Imagen real cargada desde ImgBB!')}
                onError={() => console.log('Problema con ImgBB, usando fallback')}
              />
            </div>
          </Card>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
            🎯 BINGO ESCOLAR 🎯
          </h1>
        </motion.div>

        {/* Layout principal - 2 columnas */}
        <div className="flex-1 grid grid-cols-5 gap-4">
          {/* Bolillero, Controles, Estadísticas e Historial - Columna izquierda */}
          <div className="col-span-2 space-y-3">
            {/* Bolillero */}
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">🎱 BOLILLERO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Animación del bolillero */}
                  <motion.div 
                    animate={isDrawing ? { rotate: 360 } : {}}
                    transition={{ duration: 2, repeat: isDrawing ? Infinity : 0, ease: "linear" }}
                    className={`
                      w-24 h-24 mx-auto rounded-full border-6 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center
                    `}
                  >
                    {isDrawing ? (
                      <Dices className="w-8 h-8 text-white" />
                    ) : currentNumber ? (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="text-2xl font-bold text-white"
                      >
                        {currentNumber}
                      </motion.div>
                    ) : (
                      <div className="text-gray-500 text-center text-xs">
                        Presiona<br/>TIRAR
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Número actual grande */}
                  <AnimatePresence>
                    {currentNumber && !isDrawing && (
                      <motion.div 
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0, y: -20 }}
                        className="mt-2 text-center"
                      >
                        <motion.div 
                          animate={{ y: [0, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-4xl font-bold text-red-600"
                        >
                          {currentNumber}
                        </motion.div>
                        <div className="text-sm text-gray-600">
                          ¡Último número!
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Controles */}
            <Card className="shadow-xl">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {!gameStarted ? (
                    <Button
                      onClick={startGame}
                      className="w-full bg-green-500 hover:bg-green-600"
                      size="lg"
                    >
                      <Rocket className="mr-2 h-4 w-4" />
                      COMENZAR
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={drawNumber}
                        disabled={isDrawing || availableNumbers.length === 0}
                        className="w-full"
                        size="lg"
                        variant={isDrawing || availableNumbers.length === 0 ? "secondary" : "default"}
                      >
                        <Dices className="mr-2 h-4 w-4" />
                        {isDrawing ? 'TIRANDO...' : 'TIRAR'}
                      </Button>
                      
                      <Button
                        onClick={resetGame}
                        className="w-full"
                        size="lg"
                        variant="outline"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        REINICIAR
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Estadísticas */}
                {gameStarted && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-2 bg-gray-100 rounded-lg"
                  >
                    <div className="text-xs text-gray-600 text-center">
                      <div>Salidos: <span className="font-bold text-red-600">{calledNumbers.length}</span></div>
                      <div>Restantes: <span className="font-bold text-green-600">{availableNumbers.length}</span></div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Historial - Ahora abajo */}
            <Card className="shadow-xl flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-center">📋 HISTORIAL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-48 overflow-y-auto">
                  {calledNumbers.length === 0 ? (
                    <p className="text-gray-500 text-center italic text-sm">
                      Los números aparecerán aquí
                    </p>
                  ) : (
                    <AnimatePresence>
                      <div className="space-y-1">
                        {calledNumbers.slice().reverse().map((num, index) => (
                          <motion.div
                            key={num}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 50, opacity: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                              flex items-center justify-between p-2 rounded-lg text-sm
                              ${index === 0
                                ? 'bg-red-100 border-2 border-red-300' 
                                : 'bg-gray-50'
                              }
                            `}
                          >
                            <span className="font-bold text-red-600 text-lg">
                              {num}
                            </span>
                            <span className="text-xs text-gray-500">
                              #{calledNumbers.length - index}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </AnimatePresence>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tablero de Números - Columna derecha más grande */}
          <div className="col-span-3">
            <Card className="shadow-xl h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-center">🎯 TABLERO DE NÚMEROS</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  {renderNumberBoard()}
                </div>
                
                <div className="mt-3 text-center text-xs text-gray-600">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Salidos</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-white border-2 border-gray-300 rounded"></div>
                      <span>Disponibles</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BingoEscolar;