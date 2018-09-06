export const staffMetrics = {
    margin: 25,
    clefSpace: 80,
    lineNumber: 5,
    width: 640,
    height: 180,
    lineDistance: 0,
    topLineY: 0,
    leftScoreStart: 0,
    rightScoreEnd: 0,

    resize() {
        let emptySpace = 3 * this.margin + 2 * this.lineNumber;
        let availableSpace = this.height - emptySpace;
        this.lineDistance = availableSpace / this.lineNumber;
        this.topLineY = this.margin + this.lineDistance / 2;
        this.leftScoreStart = this.clefSpace;
        this.rightScoreEnd = this.width - this.margin;
    },

    calcNoteY(note){
        const midGPos = this.topLineY + 3 * this.lineDistance;
        return midGPos - note.distanceFromMidG * this.lineDistance / 2;
    },
}