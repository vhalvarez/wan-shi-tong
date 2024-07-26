<template>
    <div
        class="bg-no-repeat bg-cover bg-center relative"
        style="
            background-image: url(https://cdnb.artstation.com/p/assets/images/images/051/937/309/large/meghan-casey-mosaic.jpg?1658529595);
        "
    >
        <!-- <div
            class="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0"
        ></div> -->
        <div class="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
            <div class="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
                <div class="self-start hidden lg:flex flex-col text-white">
                    <img src="" class="mb-3" />
                    <h3 class="mb-3 font-normal text-2xl">Bienvenido a,</h3>
                    <h1 class="mb-3 font-bold text-6xl uppercase">wan shi tong</h1>
                    <p class="pr-3">
                        Wan Shi Tong (万事通) es una frase en chino mandarín que significa "Aquel
                        que Conoce Mil Cosas".
                    </p>
                </div>
            </div>

            <RouterView />
        </div>
    </div>
</template>
