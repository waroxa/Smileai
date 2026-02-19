import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface AnimatedSmilePlayerProps {
  beforeImage: string;
  afterImage: string;
  isPlaying?: boolean;
}

export function AnimatedSmilePlayer({ beforeImage, afterImage, isPlaying = true }: AnimatedSmilePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();
  const lastFrameTime = useRef<number>(0);
  
  const fps = 30;
  const frameDuration = 1000 / fps; // milliseconds per frame
  const totalFrames = 90; // 3 second animation at 30fps
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Load images
    const beforeImg = new Image();
    const afterImg = new Image();
    
    beforeImg.crossOrigin = 'anonymous';
    afterImg.crossOrigin = 'anonymous';
    
    beforeImg.src = beforeImage;
    afterImg.src = afterImage;
    
    Promise.all([
      new Promise((resolve) => beforeImg.onload = resolve),
      new Promise((resolve) => afterImg.onload = resolve)
    ]).then(() => {
      // Set canvas size to match images
      canvas.width = Math.min(beforeImg.width, 800);
      canvas.height = Math.min(beforeImg.height, 600);
      
      // Animation loop
      const animate = (timestamp: number) => {
        if (!lastFrameTime.current) lastFrameTime.current = timestamp;
        
        const elapsed = timestamp - lastFrameTime.current;
        
        if (elapsed >= frameDuration) {
          lastFrameTime.current = timestamp;
          
          setCurrentFrame((prevFrame) => {
            const nextFrame = (prevFrame + 1) % totalFrames;
            
            // Calculate progress
            const progress = nextFrame / totalFrames;
            
            // Smooth easing function (ease-in-out)
            const eased = progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw before image with decreasing opacity
            ctx.globalAlpha = 1 - eased;
            ctx.drawImage(beforeImg, 0, 0, canvas.width, canvas.height);
            
            // Draw after image with increasing opacity
            ctx.globalAlpha = eased;
            ctx.drawImage(afterImg, 0, 0, canvas.width, canvas.height);
            
            return nextFrame;
          });
        }
        
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    });
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [beforeImage, afterImage, isPlaying]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-lg"
        style={{ maxHeight: '400px', objectFit: 'contain' }}
      />
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
        {currentFrame < totalFrames / 2 ? 'Before' : 'After'}
      </div>
    </motion.div>
  );
}
