// Phase 1 placeholder — full board implemented in Phase 2.
export default function Board() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">My Board</h1>
      <p className="mt-2 text-monday-muted" data-testid="board-empty">
        Your board is ready. Tasks coming next.
      </p>
    </div>
  )
}
