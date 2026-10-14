import { render, screen, fireEvent } from "@testing-library/react";
import FileDropZone, { isFileAccepted } from "./FileDropZone";

const pdf = new File(["a"], "a.pdf", { type: "application/pdf" });
const txt = new File(["b"], "b.txt", { type: "text/plain" });
const setup = (props = {}) => {
  const onFiles = vi.fn();
  const onReject = vi.fn();
  render(
    <FileDropZone
      accept="application/pdf,image/png,.docx"
      onFiles={onFiles}
      onReject={onReject}
      {...props}
    >
      drop here
    </FileDropZone>
  );
  return { el: screen.getByRole("region", { name: "File drop zone" }), onFiles, onReject };
};

describe("FileDropZone", () => {
  it("accepts a PDF", () => {
    const { el, onFiles, onReject } = setup();
    fireEvent.drop(el, { dataTransfer: { files: [pdf] } });
    expect(onFiles).toHaveBeenCalledWith([pdf]);
    expect(onReject).not.toHaveBeenCalled();
  });
  it("rejects a txt", () => {
    const { el, onFiles, onReject } = setup();
    fireEvent.drop(el, { dataTransfer: { files: [txt] } });
    expect(onReject).toHaveBeenCalledWith([txt]);
    expect(onFiles).not.toHaveBeenCalled();
  });
  it("splits mixed drops", () => {
    const { el, onFiles, onReject } = setup();
    fireEvent.drop(el, { dataTransfer: { files: [pdf, txt] } });
    expect(onFiles).toHaveBeenCalledWith([pdf]);
    expect(onReject).toHaveBeenCalledWith([txt]);
  });
  it("toggles dragging state", () => {
    const { el } = setup();
    fireEvent.dragOver(el);
    expect(el).toHaveAttribute("data-dragging", "true");
    fireEvent.dragLeave(el);
    expect(el).not.toHaveAttribute("data-dragging", "true");
  });
  it("ignores drops when disabled", () => {
    const { el, onFiles, onReject } = setup({ disabled: true });
    fireEvent.drop(el, { dataTransfer: { files: [pdf, txt] } });
    expect(onFiles).not.toHaveBeenCalled();
    expect(onReject).not.toHaveBeenCalled();
  });
});

describe("isFileAccepted", () => {
  it("handles extension and wildcard", () => {
    expect(isFileAccepted(new File(["x"], "r.DOCX", { type: "" }), ".docx")).toBe(true);
    expect(isFileAccepted(new File(["x"], "r.png", { type: "image/png" }), "image/*")).toBe(true);
    expect(isFileAccepted(txt, "image/*,.docx")).toBe(false);
    expect(isFileAccepted(txt, "")).toBe(true);
  });
});
