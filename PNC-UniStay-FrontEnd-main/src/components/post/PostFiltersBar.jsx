import React, { useState } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

const PostFiltersBar = ({ filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (field, value) => {
        onFiltersChange({
            ...filters,
            [field]: value,
        });
    };

    return (
        <div className="mb-8">

            {/* ░░░ BOTÓN SUPERIOR (ABRIR/CERRAR) ░░░ */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#007bce] hover:bg-[#006bb5] text-white rounded-xl shadow-md p-4 flex items-center justify-between transition-all duration-300"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg">Filtros de búsqueda</span>
                </div>

                <div className="bg-white/20 p-1.5 rounded-lg transition-colors">
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </div>
            </button>

            {/* ░░░ PANEL DESPLEGABLE ░░░ */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-white rounded-xl shadow-md p-6 border border-blue-200">

                    <div className="flex flex-col lg:flex-row lg:items-end gap-4">

                        {/* ░░░ RANGO DE PRECIOS ░░░ */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>
                                <label className="block text-sm font-semibold text-blue-900 mb-2">
                                    Precio mínimo ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.minPrice}
                                    onChange={(e) => handleChange("minPrice", e.target.value)}
                                    placeholder="Ej: 150"
                                    className="w-full rounded-lg border-2 border-blue-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-blue-900 mb-2">
                                    Precio máximo ($)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                                    placeholder="Ej: 300"
                                    className="w-full rounded-lg border-2 border-blue-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                            </div>

                        </div>

                        {/* ░░░ DISTANCIA ░░░ */}
                        <div className="w-full md:w-56">
                            <label className="block text-sm font-semibold text-blue-900 mb-2">
                                Distancia máxima a la UCA (km)
                            </label>
                            <select
                                value={filters.maxDistanceKm}
                                onChange={(e) => handleChange("maxDistanceKm", e.target.value)}
                                className="w-full rounded-lg border-2 border-blue-300 px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Cualquier distancia</option>
                                <option value="1">Hasta 1 km</option>
                                <option value="3">Hasta 3 km</option>
                                <option value="5">Hasta 5 km</option>
                                <option value="10">Hasta 10 km</option>
                            </select>
                        </div>

                        {/* ░░░ BOTONES ░░░ */}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={onClearFilters}
                                className="px-5 py-2.5 rounded-lg border-2 border-blue-400 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                            >
                                Limpiar
                            </button>

                            <button
                                onClick={onApplyFilters}
                                className="px-6 py-2.5 rounded-lg bg-[#007bce] text-white text-sm font-semibold hover:bg-[#006bb5] shadow-md"
                            >
                                Aplicar filtros
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostFiltersBar;