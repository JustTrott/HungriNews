import requests
import dateparser
import random
from bs4 import BeautifulSoup

def fetch_articles_from_page(page_number):
    url = f"https://tengrinews.kz/news/page/{page_number}/"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    articles = []  
    for article_tag in soup.find_all("div", {"class": "content_main_item"}):
        link = article_tag.find('a')['href'] if article_tag.find('a') else 'No Link'
        image = article_tag.find('img')['src'] if article_tag.find('img') else 'No Image'
        title_tag = article_tag.find("span", {"class": "content_main_item_title"})
        title = title_tag.find('a').text if title_tag else 'No Title'
        article = {}
        article['title'] = title
        article['image'] = "https://tengrinews.kz" + image
        
        articles.append((article, link))
    
    return articles

def fetch_article_details(article, link):
    article_response = requests.get("https://tengrinews.kz" + link)
    article_soup = BeautifulSoup(article_response.content, 'html.parser')
    
    date = article_soup.find(class_="date-time").text.strip()  
    views = random.randint(1, 1000)
    description = article_soup.find(class_="content_main_desc").find("p").text.strip()
    text_soup = article_soup.find(class_="content_main_text")  
    text = ""
    for tag in text_soup.find_all("p")[1:]:
        if tag.text != '':
            text += tag.text + "\n\n"
    article['date'] = dateparser.parse(date).isoformat()
    article['views'] = views
    article['description'] = description
    article['body'] = text
    
    return article


if __name__ == "__main__":
    page_number = 1
    articles = fetch_articles_from_page(page_number)
    print(articles)