"use client"

import { useState, useEffect } from "react"
import { Icon } from "@iconify/react"

// Define the data structure
interface HolderData {
  wallet: string
  percentage: string
  amount: string
  value: string
}

export default function TokenHoldersV2() {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile viewport on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Mock data based on the image
  const holders: HolderData[] = [
    {
      wallet: "UwMtRo...Rs27",
      percentage: "12.03%",
      amount: "724K",
      value: "$2.40",
    },
    {
      wallet: "7dcwC8...t3BU",
      percentage: "12.01%",
      amount: "723K",
      value: "$2.40",
    },
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return "↕"
    }
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const parseAmount = (amount: string): number => {
    const numStr = amount.replace(/[^\d.]/g, "")
    const num = Number.parseFloat(numStr)

    if (amount.includes("K")) return num * 1000
    if (amount.includes("M")) return num * 1000000
    if (amount.includes("B")) return num * 1000000000

    return num
  }

  // Copy of data for sorting
  const sortedHolders = [...holders].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: number
    let bValue: number

    switch (sortColumn) {
      case "percentage":
        aValue = Number.parseFloat(a.percentage.replace("%", ""))
        bValue = Number.parseFloat(b.percentage.replace("%", ""))
        break
      case "amount":
        // Handle K, M, B suffixes
        aValue = parseAmount(a.amount)
        bValue = parseAmount(b.amount)
        break
      case "value":
        aValue = Number.parseFloat(a.value.replace("$", ""))
        bValue = Number.parseFloat(b.value.replace("$", ""))
        break
      case "wallet":
        // For wallet, use string comparison
        return sortDirection === "asc" ? a.wallet.localeCompare(b.wallet) : b.wallet.localeCompare(a.wallet)
      default:
        return 0
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  // Mobile Card View
  const renderMobileHolderCards = () => {
    return (
      <div className="space-y-3 px-2">
        {sortedHolders.map((holder, index) => (
          <div key={index} className="bg-[#1e1e1e] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#181818]">
                <Icon icon="solar:wallet-bold-duotone" className="text-primary" width="20" height="20" />
              </div>
              <span className="text-primary hover:underline cursor-pointer font-medium">{holder.wallet}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-gray-400 text-xs mb-1">% Owned</p>
                <p className="text-white">{holder.percentage}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Amount</p>
                <p className="text-white">{holder.amount}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Value</p>
                <p className="text-white">{holder.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full  bg-[#0e0f13] rounded-md overflow-hidden">
      {isMobile ? (
        renderMobileHolderCards()
      ) : (
        <>
          {/* Table Header */}
          <div className="grid grid-cols-4 border-b border-gray-800 py-3 px-6 text-sm font-medium">
            <div
              className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white"
              onClick={() => handleSort("wallet")}
            >
              Wallet <span className="text-gray-500 ml-1 text-xs">{getSortIcon("wallet")}</span>
            </div>
            <div
              className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white"
              onClick={() => handleSort("percentage")}
            >
              % Owned <span className="text-gray-500 ml-1 text-xs">{getSortIcon("percentage")}</span>
            </div>
            <div
              className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white"
              onClick={() => handleSort("amount")}
            >
              Amount <span className="text-gray-500 ml-1 text-xs">{getSortIcon("amount")}</span>
            </div>
            <div
              className="flex items-center gap-1 text-gray-500 cursor-pointer duration-200 transition-all ease-in hover:text-white"
              onClick={() => handleSort("value")}
            >
              Value <span className="text-gray-500 ml-1 text-xs">{getSortIcon("value")}</span>
            </div>
          </div>

          {/* Table Rows */}
          {sortedHolders.map((holder, index) => (
            <div
              key={index}
              className="grid grid-cols-4 py-4 px-6 border-b border-gray-800 text-sm items-center hover:bg-gray-900 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#181818]">
                  <Icon icon="solar:wallet-bold-duotone" className="text-primary" width="24" height="24" />
                </div>
                <span className="text-primary hover:underline cursor-pointer">{holder.wallet}</span>
              </div>
              <div className="text-white">{holder.percentage}</div>
              <div className="text-white">{holder.amount}</div>
              <div className="text-white">{holder.value}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
