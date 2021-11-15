<template>
    <component v-bind:="linkProps(to)">
        <slot />
    </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { defineComponent} from vue;
export default defineComponent({
   props: {
    to: {
      type: String,
      required: true
    }
  },
  setup(){
   const  linkProps=(url)=> {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
    return {
      linkProps
    }
  }
})
</script>
