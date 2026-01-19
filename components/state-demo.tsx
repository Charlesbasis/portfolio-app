"use client";

import { useState, useEffect, useRef } from "react";
import { StateManager, treeMap } from "@/lib/state-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Save, History } from "lucide-react";

interface TrainingState {
  step: number;
  loss: number;
  parameters: {
    weights: number[][];
    bias: number;
  };
}

export function StateDemo() {
  const [manager] = useState(() => new StateManager<TrainingState>({
    step: 0,
    loss: 1.0,
    parameters: {
      weights: [[0.5, -0.5], [0.1, 0.9]],
      bias: 0.0,
    },
  }));

  const [state, setState] = useState(manager.getState());
  const [isRunning, setIsRunning] = useState(false);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const step = () => {
    manager.update((s) => {
      // Simulate training step: decrease loss, perturb weights
      const newLoss = s.loss * 0.95 + Math.random() * 0.01;
      const newWeights = treeMap(s.parameters.weights, (w: number) => w + (Math.random() - 0.5) * 0.05);
      
      return {
        ...s,
        step: s.step + 1,
        loss: newLoss,
        parameters: {
          ...s.parameters,
          weights: newWeights,
        },
      };
    });
    setState(manager.getState());
  };

  const toggleRunning = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(step, 500);
    }
    setIsRunning(!isRunning);
  };

  const handleCheckpoint = () => {
    const snap = manager.checkpoint({ note: `Manual checkpoint at step ${state.step}` });
    setSnapshots([...snapshots, snap]);
  };

  const handleRestore = (snap: any) => {
    manager.restore(snap);
    setState(manager.getState());
  };

  const handleReset = () => {
    manager.rollback(); // For demo, just rollback once
    setState(manager.getState());
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          State Management Demo
          <Badge variant="outline">Inspired by JAX/Flax</Badge>
        </CardTitle>
        <CardDescription>
          Simulating a "TrainState" with checkpointing and recursive tree mapping.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Current Step</div>
                <div className="text-3xl font-mono font-bold">{state.step}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Loss</div>
                <div className="text-3xl font-mono font-bold text-primary">{state.loss.toFixed(6)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Parameters (Weights)</div>
              <div className="grid grid-cols-2 gap-2">
                {state.parameters.weights.flat().map((w, i) => (
                  <div key={i} className="p-2 border rounded font-mono text-xs text-center">
                    {w.toFixed(4)}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={toggleRunning}
                variant={isRunning ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Stop" : "Start Training"}
              </Button>
              <Button
                onClick={handleCheckpoint}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Checkpoint
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Rollback
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Checkpoints
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {snapshots.length === 0 && (
                <div className="text-sm text-muted-foreground italic py-4">No checkpoints yet.</div>
              )}
              {snapshots.map((snap, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 border rounded hover:bg-muted cursor-pointer transition-colors"
                  onClick={() => handleRestore(snap)}
                >
                  <div>
                    <div className="text-sm font-medium">Snapshot v{snap.version}</div>
                    <div className="text-xs text-muted-foreground">Loss: {snap.data.loss.toFixed(4)}</div>
                  </div>
                  <Badge variant="outline">Restore</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
