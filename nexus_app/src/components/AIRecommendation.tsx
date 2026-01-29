import React from "react";
import { Resource } from "../types";

interface Props {
  resource: Resource;
  all: Resource[];
}

const AIRecommendation: React.FC<Props> = ({ resource, all }) => {
  const suggestion = all.find(
    r =>
      r.id !== resource.id &&
      r.type === resource.type &&
      r.status === "available"
  );

  if (!suggestion) return null;

  return (
    <div className="mt-6 p-5 border border-blue-500/20 bg-blue-500/10 rounded-2xl">
      <div className="text-xs font-black tracking-widest text-blue-400 mb-2">
        AI SUGGESTION
      </div>
      <div className="text-sm font-bold">
        {suggestion.name}
      </div>
      <p className="text-[11px] text-white/50 mt-1">
        Similar capacity · Available now
      </p>
    </div>
  );
};

export default AIRecommendation;