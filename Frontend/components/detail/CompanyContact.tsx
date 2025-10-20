'use client';

import { CompanyContactProps } from '@/types';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function CompanyContact({ fadeInUp }: CompanyContactProps) {
    return (
        <motion.section
            {...fadeInUp}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mt-10"
        >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contáctanos</h2>
            <p className="text-gray-600 mb-6">
                ¿Interesado en esta propiedad? Nuestro equipo estará encantado de atenderte.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Teléfono</p>
                        <p className="text-gray-600">+57 310 123 4567</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Correo</p>
                        <a
                            href="mailto:contacto@inmobiliaria.com"
                            className="text-green-700 hover:underline"
                        >
                            contacto@inmobiliaria.com
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Oficina principal</p>
                        <p className="text-gray-600">Cra 7 #45-10, Bogotá, Colombia</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <a
                    href="https://wa.me/573101234567?text=Hola, estoy interesado en una propiedad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition"
                >
                    <MessageCircle className="w-4 h-4" /> Contactar por WhatsApp
                </a>
            </div>
        </motion.section>
    );
}
