const ERC165Abi = [
  'function supportsInterface(bytes4 interfaceId) view returns (bool)',
]

const ERC721Abi = [
  ...ERC165Abi,
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
]

const ERC1155Abi = [
  ...ERC165Abi,
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
]

const ERC20Abi = [
  ...ERC165Abi,
  'function name() view returns (string)',
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
]

export { ERC721Abi, ERC1155Abi, ERC20Abi, ERC165Abi }
