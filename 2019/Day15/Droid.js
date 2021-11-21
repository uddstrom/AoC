import IntcodeComputer from '../lib/IntcodeComputer.js';

export class Droid {
    constructor(x, y, code) {
        this.x = x;
        this.y = y;
        this.computer = IntcodeComputer(code, [1]);
    }

    move(dir) {
        // north (1), south (2), west (3), and east (4)
        const status = this.computer.next(dir).value;
        let feedback;
        switch (dir) {
            case 1:
                feedback = { x: this.x, y: this.y - 1, status };
                if (status > 0) this.y--;
                break;
            case 2:
                feedback = { x: this.x, y: this.y + 1, status };
                if (status > 0) this.y++;
                break;
            case 3:
                feedback = { x: this.x - 1, y: this.y, status };
                if (status > 0) this.x--;
                break;
            case 4:
                feedback = { x: this.x + 1, y: this.y, status };
                if (status > 0) this.x++;
                break;
        }
        return feedback;
    }
}
