"use client"
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import React, { createContext } from "react"
import FormikProviders from "./formik"
import UploadImage from "./UploadImage"
import InputFields from "./InputFields"
import { AppButton } from "@app/_shared"

interface IFinishSelectPairContext {
  finishSelectPair: boolean;
  setFinishSelectPair: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FinishSelectPairContext =
  createContext<IFinishSelectPairContext | null>(null)

const MainForm = () => {
    return (
        <Card>
            <CardHeader className="p-5">
                <div className="font-bold text-lg">Create NFT</div>
            </CardHeader>
            <Divider />
            <CardBody>
                <FormikProviders>
                    <div className="grid sm:grid-cols-2 grid-cols-1 gap-12">
                        <UploadImage />
                        <div className="flex flex-col justify-between gap-6">
                            <InputFields />
                            <AppButton content="Create" className="w-full" typeSubmit/>
                        </div>

                    </div>
                </FormikProviders>
            </CardBody>
        </Card>
    )
}

export default MainForm