export function switchGender(e: React.MouseEvent) {
    let currEl = e.target as HTMLInputElement;
    const parentEl = currEl.parentNode as HTMLDivElement;
    const childNodes = [...parentEl.childNodes] as HTMLInputElement[];
    currEl.className === "male"
      ? (childNodes[1].checked = false)
      : (childNodes[0].checked = false);
    console.log(childNodes);
  }