import { Sunset } from "react-feather";

export default {
  name: 'pageheader',
  type: 'document',
  title: 'Page header',
  icon: Sunset,
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'inngress',
      title: 'Inngress',
      type: 'text',
      rows: 3
    },
    {
      name: 'centered',
      title: 'Centered',
      type: 'boolean'
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }, { type: 'navitem' }]
    },
    {name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'},
    {name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo'},
    {name: 'seoImage', title: 'SEO Image', type: 'image', group: 'seo'},
  ]
}