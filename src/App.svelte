<script>
	import TodoList from './lib/TodoList.svelte';
	import TodoAdder from './lib/TodoAdder.svelte';
</script>

<main class="todo">
  <span class="todo__title">TODO APP SVELTE</span>
  <TodoAdder />
  <TodoList />
  <span class="todo__footer">Made by Alxx</span>
</main>

<style lang="scss">
  @import 'styles/variables.scss';
  @import 'styles/mixins.scss';

  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .todo {
    margin: 0 auto;
    padding: 1em;
    text-align: center;

    &__title {
      color: $orange;
      display: inline-block;
      font-size: 2rem;
      font-weight: 100;
      line-height: 1.1;
      margin: 0 0 20px;
      margin: 2rem auto;
      text-transform: uppercase;
    }

    &__footer {
      color: $placeholder;
      display: inline-block;
      font-size: .8rem;
      margin: 40px 0;
    }
  }

</style>
