"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    IChartApi,
} from "lightweight-charts";

import {
    buildChart,
} from "../chart/createChart";

import {
    buildSeries,
    removeSeries,
} from "../chart/createSeries";


import {
    ChartSeries,
} from "../types";
import type { ChartType } from "@/store/useTradeStore";

export function useChart(
    chartType: ChartType
) {


    /*
    =====================================================
    REFS
    =====================================================
    */


    const containerRef =
        useRef<HTMLDivElement | null>(null);


    const chartRef =
        useRef<IChartApi | null>(null);


    const seriesRef =
        useRef<ChartSeries | null>(null);



    /*
    =====================================================
    STATE
    =====================================================
    */


    const [chart, setChart] =
        useState<IChartApi | null>(null);


    const [series, setSeries] =
        useState<ChartSeries | null>(null);


    const [initialized, setInitialized] =
        useState(false);





    /*
    =====================================================
    CREATE CHART
    =====================================================
    */


    useEffect(() => {


        if (!containerRef.current) {

            console.log(
                "[useChart] Container missing"
            );

            return;

        }



        console.log(
            "[useChart] Creating chart..."
        );



        const createdChart =
            buildChart(
                containerRef.current
            );



        chartRef.current =
            createdChart;



        setChart(
            createdChart
        );


        setInitialized(true);




        const resizeObserver =
            new ResizeObserver(() => {


                if (
                    !containerRef.current ||
                    !chartRef.current
                ) {

                    return;

                }



                chartRef.current.applyOptions({

                    width:
                    containerRef.current.clientWidth,


                    height:
                    containerRef.current.clientHeight,

                });


            });



        resizeObserver.observe(
            containerRef.current
        );




        return () => {


            resizeObserver.disconnect();



            if(chartRef.current){


                if(seriesRef.current){

                    removeSeries(

                        chartRef.current,

                        seriesRef.current

                    );

                }



                chartRef.current.remove();

            }



            chartRef.current = null;

            seriesRef.current = null;


            setChart(null);

            setSeries(null);

            setInitialized(false);


        };


    }, []);







    /*
    =====================================================
    CREATE / CHANGE SERIES
    =====================================================
    */


    useEffect(() => {


        if(
            !initialized ||
            !chart
        ){

            return;

        }



        console.log(

            "[useChart] Switching series:",
            chartType

        );




        /*
        Remove old series
        */

        if(seriesRef.current){


            removeSeries(

                chart,

                seriesRef.current

            );


            seriesRef.current = null;


        }





        /*
        Create new series type
        */


        const newSeries =
            buildSeries(

                chart,

                chartType

            );





        seriesRef.current =
            newSeries;



        setSeries(
            newSeries
        );



    }, [

        initialized,

        chart,

        chartType,

    ]);







    return {


        containerRef,


        chartRef,


        seriesRef,


        chart,


        series,


        initialized,


    };


}