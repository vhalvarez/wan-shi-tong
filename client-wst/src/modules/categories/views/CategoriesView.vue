<template>
    <div>
        <div class="flex flex-col justify-center w-full">
            <div v-if="!category" class="text-center h-[500px]">
                <LoadingSpinner />
            </div>

            <div v-else>
                <CustomTitle :title="`Libros de ${category[0].category}`"/>

                <BookList :books="category" />

                <ButtonPagination :has-more-data="!!category && category.length < 6" :page="page" />
                
            </div>
        </div>
    </div>
</template>

<script src="./CategoriesView.ts" lang="ts"></script>
