<template>
   <main class="h-screen w-full flex flex-col justify-center items-center ">
	<h1 class="text-9xl font-extrabold text-secondary tracking-widest">404</h1>
	<div class="bg-primary px-2 text-sm rounded rotate-12 absolute">
		Page Not Found
	</div>
	<button class="mt-5">
      <a
        class="relative inline-block text-sm font-medium text-primary group active:text-primary focus:outline-none focus:ring"
      >
        <span
          class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-primary group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span class="relative block px-8 py-3 text-white border border-current">
          <router-link to="/">Volver</router-link>
        </span>
      </a>
    </button>
</main>
</template>
