<template>
    <footer class="footer">
        <span>Copyright <strong>RTI</strong></span>
    </footer>
</template>

<script>
export default {
    name: 'Footer'
}
</script>
    
<style>
    .footer {
        grid-area: footer;
        background-color: #596167;
        color: #eee;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
    }
</style>
