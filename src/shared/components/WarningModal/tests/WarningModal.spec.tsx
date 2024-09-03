import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import WarningModal from "../WarningModal";

describe("WarningModal Component", () => {
  const mockSetIsModalOpen = jest.fn();
  const mockHandleBtnClick = jest.fn();

  const defaultProps = {
    text: "Este é um aviso importante!",
    btnText: "Entendido",
    isModalOpen: true,
    setIsModalOpen: mockSetIsModalOpen,
    handleBtnClick: mockHandleBtnClick
  };

  it("should render the modal with correct text and button", () => {
    render(<WarningModal {...defaultProps} />);

    // Verifica se o texto do alerta é renderizado
    expect(screen.getByText(/este é um aviso importante!/i)).toBeInTheDocument();

    // Verifica se o texto do botão é renderizado
    expect(screen.getByText(/entendido/i)).toBeInTheDocument();

    // Verifica se o modal está aberto
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("should call setIsModalOpen when the close button is clicked", () => {
    render(<WarningModal {...defaultProps} />);

    // Clica no botão de fechar (ícone de X)
    fireEvent.click(screen.getByRole("button", { name: "" }));

    // Verifica se a função setIsModalOpen foi chamada com false
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("should close the modal when clicked outside of the modal content", () => {
    render(<WarningModal {...defaultProps} />);

    // Clica fora do conteúdo do modal
    fireEvent.click(screen.getByRole("presentation").parentElement!);

    // Verifica se a função setIsModalOpen foi chamada com false
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("should not render the modal when isModalOpen is false", () => {
    render(<WarningModal {...defaultProps} isModalOpen={false} />);

    // Verifica se o modal não está no documento
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
