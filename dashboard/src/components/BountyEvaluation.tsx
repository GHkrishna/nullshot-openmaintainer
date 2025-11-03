import React from "react";

interface Evaluation {
  complexity: number; // 0 to 1
  documentation: number; // 0 to 1
  codeQuality: number; // 0 to 1
}

interface Props {
  evaluation?: Evaluation;
}

export default function BountyEvaluation({ evaluation }: Props) {
  if (!evaluation) return null;

  const metrics = [
    { name: "Complexity", value: evaluation.complexity },
    { name: "Documentation", value: evaluation.documentation },
    { name: "Code Quality", value: evaluation.codeQuality },
  ];

  return (
    <div className="mt-3 space-y-2">
      {metrics.map((metric) => (
        <div key={metric.name}>
          <div className="flex justify-between text-xs mb-1">
            <span>{metric.name}</span>
            <span>{Math.round(metric.value * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 rounded-full bg-green-500"
              style={{ width: `${metric.value * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
