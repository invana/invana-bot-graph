function draw_traversal(data, graph_el_id) {
    // var traversals = [];
    console.log(data);
    var crawlers = [];

    crawlers = get_all_crawlers(data.crawlers);
    // console.log("traversals", traversals);
    console.log("crawlers", crawlers);

    var init_crawler = get_crawler_by_id(crawlers, data.init_crawler.crawler_id);
    console.log("init_crawler", init_crawler);

    // console.log(crawlers_children);

    final_data = get_crawler_traversal(init_crawler, data)
    console.log("final_data", final_data);
    drawTraversalTree(final_data, graph_el_id);
}