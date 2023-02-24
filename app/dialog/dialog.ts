import "./dialog.scss"

export class Dialog {
  public dialog: HTMLElement
  private button: HTMLButtonElement

  constructor(title: string, text: string) {
    const DIALOG = <HTMLTemplateElement>document.getElementById("messy-dialog")!
    this.dialog = DIALOG.content.firstElementChild!.cloneNode(
      true
    ) as HTMLElement

    this.dialog.querySelector(".dialog__title")!.textContent = title
    this.dialog.querySelector(".dialog__text")!.textContent = text

    this.button = this.dialog.querySelector(".dialog__button.default")!
    this.button.addEventListener("click", () => this.close())
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.close()
      }
    })
  }

  close() {
    this.dialog.remove()
  }
}
