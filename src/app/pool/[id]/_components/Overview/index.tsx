"use client"

import React, { useContext } from "react"
import { Card, CardBody } from "@nextui-org/react"
import TokenLocked from "./TokenLocked"
import { DataWidgetDisplay } from "@app/_shared"
import { TokenStateContext } from "../../layout"

interface OverviewProps {
    className? : string
}

const Overview = (props: OverviewProps) => {
    const tokenState = useContext(TokenStateContext)
    if (tokenState == null) return
    return (
        <Card className = {`${props.className}`}>
            <CardBody className="flex flex-col justify-between">
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <DataWidgetDisplay
                            title="Liquidity"
                            value={123123}
                            size="sm"
                            finishLoad={true} />
                        <DataWidgetDisplay
                            title="Volume 24h"
                            value={123123}
                            size="sm"
                            finishLoad={true} 
                        />
                    </div>
                </div>
                <TokenLocked />
            </CardBody>
        </Card>
    )
}

export default Overview
