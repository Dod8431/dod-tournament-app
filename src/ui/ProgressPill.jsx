export default function ProgressPill({ round, index, total }){
  return (
    <div className="u-pill">
      <span>Round {round}</span>
      <span>•</span>
      <span>Match {index} / {total}</span>
    </div>
  );
}
