import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import Form from "./Form";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k) => k, i18n: { language: "en" } })
}));
vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("../redux/reducers/userReducer", () => ({ sessionStatus: vi.fn() }));
vi.mock("../utils", () => ({ withSessionValidation: (fn) => fn }));
vi.mock("../utils/acroFieldExtractor", () => ({
  isPdfPasswordProtected: vi.fn(async () => false),
  clearAcroFields: vi.fn(async (b) => b)
}));
vi.mock("../constant/saveFileSize", () => ({ SaveFileSize: vi.fn() }));
vi.mock("../components/shared/fields/SelectFolder", () => ({ default: () => null }));
vi.mock("../components/shared/fields/SignersInput", () => ({ default: () => null }));
vi.mock("react-tooltip", () => ({ Tooltip: () => null }));
vi.mock("axios", () => ({ default: { post: vi.fn(), get: vi.fn() } }));
vi.mock("pdf-lib", () => {
  const doc = {
    copyPages: async () => [],
    addPage: () => {},
    getPageIndices: () => [],
    save: async () => new Uint8Array([1, 2, 3])
  };
  return { PDFDocument: { create: async () => doc, load: async () => doc } };
});
vi.mock("parse", () => {
  class File {
    save() {
      return Promise.resolve({ url: () => "https://x/file.pdf" });
    }
  }
  const Parse = { File, User: { current: () => null } };
  return { default: Parse };
});
vi.mock("../constant/Utils", () => ({
  toDataUrl: vi.fn(),
  decryptPdf: vi.fn(),
  base64ToFile: vi.fn(),
  removeTrailingSegment: (s) => s,
  getFileAsArrayBuffer: vi.fn(async () => new ArrayBuffer(4)),
  getSecureUrl: vi.fn(async () => ({ url: "https://x/secure.pdf" })),
  generatePdfName: () => "abc",
  generateTitleFromFilename: (n) => n
}));

const mount = () =>
  render(
    <MemoryRouter initialEntries={["/form/sHAnZphf69"]}>
      <Routes>
        <Route path="/form/:id" element={<Form />} />
      </Routes>
    </MemoryRouter>
  );

describe("Form drop zone integration", () => {
  beforeEach(() => {
    window.alert = vi.fn();
  });

  it("renders the drop zone", () => {
    mount();
    expect(screen.getByRole("region", { name: "File drop zone" })).toBeInTheDocument();
    expect(screen.getByText("drag-drop-or-browse")).toBeInTheDocument();
  });

  it("dropping a PDF reaches the files-selected state", async () => {
    mount();
    const pdf = new File(["%PDF"], "contract.pdf", { type: "application/pdf" });
    fireEvent.drop(screen.getByRole("region", { name: "File drop zone" }), {
      dataTransfer: { files: [pdf] }
    });
    expect(await screen.findByText(/files-selected: contract\.pdf/)).toBeInTheDocument();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("dropping a text file alerts and is not selected", async () => {
    mount();
    const txt = new File(["x"], "notes.txt", { type: "text/plain" });
    fireEvent.drop(screen.getByRole("region", { name: "File drop zone" }), {
      dataTransfer: { files: [txt] }
    });
    expect(window.alert).toHaveBeenCalledWith("file-type-not-supported");
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByText(/files-selected/)).not.toBeInTheDocument();
  });
});
