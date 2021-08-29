import { useEffect, useState } from "react";
import kokopu from "kokopu";
import "kokopu-react/dist/lib/css/arrow.css";
import { Chessboard } from "kokopu-react";

const GameViewer = () => {
  const moves = kokopu
    .pgnRead(
      `[Event "Bot VS StockFish"]
      [Site "https://lichess.org/NCNZZetQ"]
      [Date "24/08/2021"]
      [Round "1"]
      [White "Bot"]
      [Black "StockFish"]
      [Result "0-1"]
      [WhiteElo "?"]
      [BlackElo "?"]
      [Variant "Standard"]
      [TimeControl "-"]
      [ECO "C21"]
      [Opening "Center Game Accepted"]
      [Termination "Normal"]
      [Annotator "lichess.org"]
      
      1. e4 e5 2. d4 exd4 { C21 Center Game Accepted } 3. Bg5?? { (-0.15 → -5.53) Blunder. Nf3 was best. } (3. Nf3 Bb4+ 4. Nbd2 Nc6 5. a3 Bxd2+ 6. Qxd2 Nf6 7. e5 Ne4) 3... Qxg5 4. Nf3 Qg6 5. Ne5 Qxe4+ 6. Qe2 Nf6 7. Qxe4 Nxe4 8. Nxd7 Bxd7 9. f3 Bb4+ 10. c3 dxc3 11. bxc3 Nxc3 12. a3 Ba5 13. Nxc3 Bxc3+ 14. Kf2 Bxa1 15. Bb5 Bd4+ 16. Kg3 Bxb5 17. Rd1 Nc6 18. a4 Bxa4 19. Rxd4 Nxd4 20. h4 h5 21. f4 Nf5+ 22. Kh2 O-O-O 23. g4 hxg4 24. Kg1 Rd1+ 25. Kf2 Rhd8 26. h5 R8d2# { Black wins by checkmate. } 0-1`
    )
    .game(2)
    .mainVariation()
    .nodes()
    .map((g: any) => g.notation());

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [fen, setFen] = useState<any>(new kokopu.Position("regular"));

  return (
    <div>
      <button
        disabled={!fen.hasMove()}
        onClick={() => {
          console.log(moves[currentIndex]);
          fen.play(moves[currentIndex]);
          setCurrentIndex((currentIndex) => currentIndex + 1);
        }}
      >
        See next move
      </button>
      <Chessboard
        animated
        moveArrowVisible
        position={fen}
        move={moves[currentIndex]}
      />
    </div>
  );
};

export default GameViewer;
