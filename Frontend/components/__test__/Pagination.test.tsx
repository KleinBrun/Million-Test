import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, expect } from "vitest";
import Pagination from "../Pagination";

describe("Pagination simple test", () => {
    it("botones y pageSize funcionan", () => {
        const onChange = vi.fn();
        const onPageSizeChange = vi.fn();

        render(
            <Pagination
                currentPage={1}
                totalPages={3}
                onChange={onChange}
                pageSize={6}
                onPageSizeChange={onPageSizeChange}
            />
        );

        expect(screen.getByLabelText("Ir a la primera página")).toBeDisabled();
        expect(screen.getByLabelText("Página anterior")).toBeDisabled();
        expect(screen.getByLabelText("Página siguiente")).toBeEnabled();
        expect(screen.getByLabelText("Ir a la última página")).toBeEnabled();

        fireEvent.click(screen.getByLabelText("Página siguiente"));
        expect(onChange).toHaveBeenCalledWith(2);

        const select = screen.getByLabelText("Tamaño de página") as HTMLSelectElement;
        fireEvent.change(select, { target: { value: "12" } });
        expect(onPageSizeChange).toHaveBeenCalledWith(12);
    });
});
