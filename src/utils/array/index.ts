export interface BigIntElement {
  index: number;
  value: bigint;
}

const findMaxBigIntIndexAndValue = (array: bigint[]): BigIntElement => {
    if (!array.length) {
        throw new Error("Cannot find maximum index in an empty array")
    }

    let maxIndex = 0
    for (let i = 1; i < array.length; i++) {
        if (array[i] > array[maxIndex]) {
            maxIndex = i
        }
    }
    const value = array[maxIndex]

    return {
        index: maxIndex,
        value,
    }
}

const findMinBigIntIndexAndValueExceptZero = (array: bigint[]): BigIntElement => {
    if (!array.length) {
        throw new Error("Cannot find minimum index in an empty array")
    }
    array = array.filter(element => element > BigInt(0))
    if (!array.length) {
        throw new Error("All elements in the array are zero")
    }

    let minIndex = 0
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[minIndex]) {
            minIndex = i
        }
    }
    const value = array[minIndex]
   
    return {
        index: minIndex,
        value,
    }
}

const arrayUtils = {
    findMaxBigIntIndexAndValue: findMaxBigIntIndexAndValue,
    findMinBigIntIndexAndValueExceptZero: findMinBigIntIndexAndValueExceptZero
} 

export default arrayUtils