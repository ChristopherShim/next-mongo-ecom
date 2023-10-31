import Layout from '@/components/Layout'
import React from 'react'
import Link from 'next/link'

const products = () => {
  return (
    <Layout>
      <Link className="bg-blue-900 text-white py-1 px-2 rounded-md" href="/products/new">Add new product</Link>
      
    </Layout>
  )
}

export default products