const abi = [
    {
        inputs: [
            { internalType: "address", name: "_token0", type: "address" },
            { internalType: "address", name: "_token1", type: "address" },
            { internalType: "uint256", name: "_amountToken0Added", type: "uint256" },
            { internalType: "uint256", name: "_amountToken1Added", type: "uint256" },
            { internalType: "uint256", name: "_token0BasePrice", type: "uint256" },
            { internalType: "uint256", name: "_token0MaxPrice", type: "uint256" },
            { internalType: "uint16", name: "_protocolFee", type: "uint16" },
            { internalType: "string", name: "_tokenSymbol", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_amountToken0Added", type: "uint256" },
            { internalType: "uint256", name: "_amountToken1Added", type: "uint256" },
        ],
        name: "addLiquidity",
        outputs: [
            {
                internalType: "uint256",
                name: "_amountLPTokenMinted",
                type: "uint256",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint256", name: "liquidity", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "amountToken0Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountToken1Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "LPTokenTotalSupply",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "timestamp", type: "uint256" },
                ],
                internalType: "struct IPoolTick.Info",
                name: "_tick",
                type: "tuple",
            },
        ],
        name: "addTick",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "allTicks",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "liquidity", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "amountToken0Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountToken1Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "LPTokenTotalSupply",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "timestamp", type: "uint256" },
                ],
                internalType: "struct IPoolTick.Info[]",
                name: "_ticks",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "amountToken0Added",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "amountToken1Added",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_amountTokenIn", type: "uint256" },
            { internalType: "bool", name: "_isToken0", type: "bool" },
        ],
        name: "amountTokenOut",
        outputs: [{ internalType: "uint256", name: "_out", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amountLPTokenRemoved",
                type: "uint256",
            },
            { internalType: "uint256", name: "_token0Percentage", type: "uint256" },
        ],
        name: "amountTokenReceivedOnLiquidityRemoval",
        outputs: [
            {
                internalType: "uint256",
                name: "_amountToken0Received",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_amountToken1Received",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "claim",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "factory",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
        name: "getTick",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "liquidity", type: "uint256" },
                    {
                        internalType: "uint256",
                        name: "amountToken0Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountToken1Locked",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "LPTokenTotalSupply",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "timestamp", type: "uint256" },
                ],
                internalType: "struct IPoolTick.Info",
                name: "_tick",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_provider", type: "address" }],
        name: "isProvider",
        outputs: [{ internalType: "bool", name: "_result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "kLast",
        outputs: [{ internalType: "uint256", name: "_result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "liquidity",
        outputs: [{ internalType: "uint256", name: "_result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "numProviders",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolFee",
        outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "providers",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "register",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_amountLPTokenRemoved",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "_percentageOfAmountToken0Received",
                type: "uint256",
            },
        ],
        name: "removeLiquidity",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "provider", type: "address" }],
        name: "rewards",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint256",
                        name: "amountToken0Collected",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "amountToken1Collected",
                        type: "uint256",
                    },
                ],
                internalType: "struct Pool.Rewards",
                name: "_result",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_amountTokenIn", type: "uint256" },
            { internalType: "uint256", name: "_minAmountTokenOut", type: "uint256" },
            { internalType: "bool", name: "_isToken0", type: "bool" },
        ],
        name: "swap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "ticks",
        outputs: [
            { internalType: "uint256", name: "liquidity", type: "uint256" },
            { internalType: "uint256", name: "amountToken0Locked", type: "uint256" },
            { internalType: "uint256", name: "amountToken1Locked", type: "uint256" },
            { internalType: "uint256", name: "LPTokenTotalSupply", type: "uint256" },
            { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token0",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token0Constant",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token1",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "token1Constant",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const
export default abi
