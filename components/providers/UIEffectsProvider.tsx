"use client";

import { ReactNode } from "react";

import ToastContainer from "@/components/ui/ToastContainer";
import FlashOverlay from "@/components/ui/FlashOverlay";

interface Props {

    children: ReactNode;

}

export default function UIEffectsProvider({

    children,

}: Props) {

    return (

        <>

            {children}

            <FlashOverlay />

            <ToastContainer />

        </>

    );

}