import { NumberInput, TitleDisplay } from "@app/_shared"
import { FormikContext } from "../../../../../_hooks"
import utils from "@utils"
import React, { useContext } from "react"

const TxDeadline = () => {
    const formik = useContext(FormikContext)!
    const onChange = (valueMul100: string) => {
        formik.setFieldValue(
            "txDeadline",
            utils.format.parseStringToNumberMultiply(valueMul100, 1 / 30)
        )
    }

    return (
        <div className="flex justify-between items-center">
            <TitleDisplay text="Tx txDeadline (mins)" tooltipText="AAA" />
            <NumberInput
                value={utils.format.parseStringToNumberMultiply(
                    formik.values.txDeadline,
                    30
                )}
                className="w-[3rem]"
                variant="bordered"
                onChange={onChange}
                placeholder="30"
            />
        </div>
    )
}
export default TxDeadline
